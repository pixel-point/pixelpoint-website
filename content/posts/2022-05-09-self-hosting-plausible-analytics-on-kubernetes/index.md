---
title: 'Self-hosting Plausible Analytics on Kubernetes'
author: Kirill Bolotsky
cover: cover.jpg
isFeatured: true
---

Have you ever had this thought that Google Analytics has turned into an alien ship control board that no mere human can handle? And you or your client probably don’t need all of those features made possible by a 50kb JS script overhead? Well, I had, that’s why a few days ago I’ve taken a short tour of the web analytic services market, checking what other options I have.

My criteria were:

- simple traffic monitoring (who, where from, what agent/device)
- low price
- lightweight
- preferably open source
- GDPR, CCPA compliant

If you’d followed my route, you’d have found out that there are loads of them, like Clicky, HubSpot, Mixpanel, Gauges, StatCounter, you name it. Digging into this considerably long list, I realized that most of them were missing at least one of my requirements, be it for price, service complexity and a heavy script, or a dull obsolete UI/UX. Most of them, but not Plausible Analytics.

So the decision was made.

## Plausible Analytics

![Plausible Analytics web interface](plausible.jpg)

[Plausible Analytics](https://plausible.io/) is a web analytics service that offers simple metrics, a tiny script, a pleasant UI, transparency, and great flexibility due to the open-source nature of the product. They have some solid selling points I almost instantly fell for, like they [don’t use cookies](https://plausible.io/privacy-focused-web-analytics#no-cookies-and-other-persistent-identifiers) (which makes them fully compliant with different cookie laws and privacy regulations), they are [EU-based and running on renewable energy](https://plausible.io/blog/made-in-eu), but most importantly, they have an option to opt-out from the cloud and just self-host it, paying literally nothing (though I’d recommend becoming a GitHub sponsor at least) if, just like me, you already have some infrastructure setup available.

## A naïve approach

So I went down with the self-hosting option, planning to place a Plausible instance into the k8s cluster managed by Rancher. However, while the related [documentation section](https://plausible.io/docs/self-hosting) includes the description of how to get the whole thing up and running, using a server with Docker installed, it doesn’t cover the k8s case at all.

First thing I did was following the naïve approach with just a single deployment based on suggested [plausible/analytics:latest](https://hub.docker.com/r/plausible/analytics) image:

- created a new `plausible` namespace
- stuffed config up with necessary env variables from [plausible-conf.env](https://github.com/plausible/hosting/blob/master/plausible-conf.env)
- ensured bind-mount persistent storage in the pre-created directory `/data/user/plausible`

No luck. The instance wasn’t able to connect to the Postgres and Clickhouse databases I assumed should be there. It meant that the Plausible image is not inclusive, there is only main product functionality wrapped up and the actual setup should have some extra steps to set up DB’s. Ok, no biggie.

Next thing was exploring the [repo](https://github.com/plausible/hosting). There I found two entities of interest:

- `docker-compose.yml`
- `kubernetes` folder

The compose file revealed that the final configuration accounted for Postgres DB (`plausible-db` ), Clickhouse DB (`plausible-events-db`) and Plausible Analytics itself (`plausible`) to be deployed alongside. Here is a very rough representation of Plausible architecture I draw to ease the understanding:

![Plausible Analytics architecture sketch](architecture.jpg)

_More on tech stack and how it works one can find in wonderful developer notes in Plausible [blog](https://plausible.io/blog/). Personally, I found especially interesting [Technology choices](https://plausible.io/blog/technology-choices), [June 2019](https://plausible.io/blog/june-2019-recap) and [April 2020](https://plausible.io/blog/april-2020-recap) Building Plausible recaps._

The `kubernetes` folder contained an unofficial documentation extension on how to run it with k8s locally with a bunch of `kubectl` commands and all the useful `yaml` configs one might be using in this case. Nice.

## An educated approach

After I had made myself familiar with all the `yaml` files mentioned above and deleted the initial deployment, I was ready to tackle it down.

### Setting up Postgres

I began with the Postgres DB deployment. It had a no-brain installation given that there was a [plausible-db.yaml](https://github.com/plausible/hosting/blob/master/kubernetes/plausible-db.yaml) present, all I did was:

- set up a new deployment based on `postgres:latest` image
- set up container port of `5432`
- ensured bind-mount storage with path `/data/user/plausible/postgresql` and a mount path of `/var/lib/postgresql/data`
- put necessary env variables

  ```yaml
  env:
    - name: POSTGRES_DB
      value: plausible
    - name: PGDATA
      value: /var/lib/postgresql/data/pgdata
    - name: POSTGRES_USER
      value: user
    - name: POSTGRES_PASSWORD
      value: password
  ```

- set up a service discovery of type `ClusterIP` , making way from `5432` port to `5432` on TCP protocol as per [config](https://github.com/plausible/hosting/blob/master/kubernetes/plausible-db.yaml#L1)

That was pretty much it, the rest of the settings were left default. The Postgres instance was up and running without any troubles.

### Setting up Clickhouse

Next on a queue was the Clickhouse DB, whose setup was very similar to the one above, so I won’t bore you to death rewriting it. Here is the [plausible-events-db.yaml](https://github.com/plausible/hosting/blob/master/kubernetes/plausible-events-db.yaml), which says it all.

The only noticeable distinction was an introduction of a `ConfigMap` :

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: plausible-events-db-config
data:
  clickhouse-config.xml: |
    <yandex>
        <logger>
            <level>warning</level>
            <console>true</console>
        </logger>
        <!-- Stop all the unnecessary logging -->
        <query_thread_log remove="remove"/>
        <query_log remove="remove"/>
        <text_log remove="remove"/>
        <trace_log remove="remove"/>
        <metric_log remove="remove"/>
        <asynchronous_metric_log remove="remove"/>
    </yandex>
  clickhouse-user-config.xml: |
    <yandex>
        <profiles>
            <default>
                <log_queries>0</log_queries>
                <log_query_threads>0</log_query_threads>
            </default>
        </profiles>
    </yandex>
```

_This thing is a small Clickhouse optimization. If you are curious, why do we need this, look at the following [commit](https://github.com/plausible/hosting/commit/1c2004fce73fd2c07e033fc7a3447a091fa7cd17)_

And then put it along the bind-mount volumes like this:

```yaml
volumeMounts:
  - name: data
    mountPath: /var/lib/clickhouse
  - name: config
    mountPath: /etc/clickhouse-server/config.d/logging.xml
    subPath: clickhouse-config.xml
    readOnly: true
  - name: config
    mountPath: /etc/clickhouse-server/users.d/logging.xml"
    subPath: clickhouse-user-config.xml
    readOnly: true
```

Add another service discovery, and there you have it, a Clickhouse DB instance.

### Setting up Plausible

The last major task was to setup Plausible itself. The same story, I took the [plausible.yaml](https://github.com/plausible/hosting/blob/master/kubernetes/plausible.yaml) and repeated series of steps above. Two notes though:

1. There has to be two containers, one of them of an `init` type running before the main container, preparing the DBs and making migration with the following command:

```yaml
initContainers:
  - name: plausible-init
    image: plausible/analytics:latest
    command:
      - '/bin/sh'
      - '-c'
    args:
      - sleep 30 && /entrypoint.sh db createdb && /entrypoint.sh db migrate && /entrypoint.sh db init-admin
```

And then runs the usual one.

2. Make sure you filled up the necessary variables correctly. Please, refer to the [configuration page](https://plausible.io/docs/self-hosting-configuration) for more info on these.

```js
// postgres://$(POSTGRES_USER):$(POSTGRES_PASSWORD)@$(PLAUSIBLE_DB_SERVICE_HOST):$(PLAUSIBLE_DB_SERVICE_PORT)/plausible
DATABASE_URL=postgres://user:password@plausible-db.plausible:5432/plausible
// http://$(CLICKHOUSE_USER):$(CLICKHOUSE_PASSWORD)@$(PLAUSIBLE_EVENTS_DB_SERVICE_HOST):$(PLAUSIBLE_EVENTS_DB_SERVICE_PORT)/plausible
CLICKHOUSE_DATABASE_URL=http://user:password@plausible-events-db.plausible:8123/plausible
ADMIN_USER_EMAIL=user@mail.com
ADMIN_USER_NAME=user
ADMIN_USER_PWD=password
// notice the protocol
BASE_URL=https://plausible.pixelpoint.io
// generate one by running "openssl rand -base64 64 | tr -d '\n'" in your terminal
SECRET_KEY_BASE=
```

Then add yet another service discovery, and everything should be working just fine. The only one minor thing left.

### Configuring the reverse proxy

The [doc](https://plausible.io/docs/self-hosting#2-reverse-proxy) says:

<Quote>
By default, Plausible runs on unencrypted HTTP on port 8000. We recommend running it on HTTPS behind a reverse proxy of some sort.
</Quote>

It made sense to me, so in my Cloudflare dashboard I set it up a simple A record with the node IP address, then went back to Rancher and added an Ingress config to expose my brand-new Plausible instance to the outer world.

Finally, the login screen appeared on my regular secured domain. I won.

![Plausible Analytics login page](login.jpg)

## That's it!

It was my personal experience self-hosting Plausible Analytics on k8s. Despite there are some bold clues how to do this, it is not obvious, which is exactly why I wrote this article. I hope you get something out of it.

Kudos to [Uku Täht](https://twitter.com/ukutaht) and [Marko Saric](https://twitter.com/@markosaric) for creating and maintaining such an amazing product, keeping it OS and supporting self-hosting version for the sake of the community.

Many thanks to [Oscar Beaumont](https://github.com/oscartbeaumont) as well, who added k8s support and instruction to self-hosting version, and it helped me big times to get through the installation burden.
