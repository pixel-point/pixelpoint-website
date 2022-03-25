---
title: 'Deploy rails application with Mina, Nginx and Puma'
description: 'Let’s find out how to deploy Ruby On Rails application with blazing fast Mina'
cover: cover.jpg
---

## What is Mina?

Mina is a deployment tool, similar to Capistrano. The major advantage of Mina is its speed. Mina works exceptionally fast because it’s a deploy Bash script generator. It generates an entire procedure as a Bash script, and runs it remotely in the server. It also supports smart command execution, so if you do not change assets (CSS, JS, images), it will not execute assets precompile. The same goes for migrations.

- [Github](https://github.com/mina-deploy/mina)
- [Mina vs. Capistrano](https://infinum.co/the-capsized-eight/faster-web-application-deployments-using-mina-instead-of-capistrano)

## Mina Setup

Let’s take a look at setting up Mina with Puma. First, you’ll need to add Mina and mina-puma in Gemfile, which is located in the development section. Mina recently changed its maintainer; a new repository is here, and it is best to install it from Git.

```ruby
gem 'mina', require: false
gem 'mina-puma', require: false,  github: 'untitledkingdom/mina-puma'
```

Add Puma gem to the global section if you are using a Rails version below 5.

Then, install gems and execute the initial Mina command for generating a config/deploy.rb file.

```bash
bundle
mina init
```

You can find an example of a Mina 1.0.0 default config here. Click here for the full config in that configuration.

## Detailed explanations of the Mina deploy file

```ruby
#Set the domain or ip address of the remote server.
set :domain, 'yourdomain.ru'

#Set the folder of the remote server where Mina will deploy your application.
set :deploy_to, 'path/to/directory'

#Set a link to the repository. Example: git@bitbucket.pixelpoint/myapp.git
set :repository, 'git@…'

#Set the name of a branch you plan to deploy as default master.
set :branch, 'master'

#Fill in the names of the files and directories that will be symlinks to the shared directory.
#All folders will be created automatically on Mina setup.
#Don’t forget to add a path to the uploads folder if you are using Dragonfly or CarrierWave.
#Otherwise, you will lose your uploads on each deploy.
set :shared_dirs, fetch(:shared_dirs, []).push('log', 'tmp/pids', 'tmp/sockets', 'public/uploads')
set :shared_files, fetch(:shared_files, []).push('config/database.yml', 'config/secrets.yml', 'config/puma.rb')

#Username of ssh user for access to the remote server.
set :user, 'username'

#This is not a required field. You can use it to set an application name for easy recognition.
set :application_name, 'MyApplication'

#Set ruby version. If you have RVM installed globally, you’ll also need to set an RVM path,
#like: set :rvm_use_path, '/usr/local/rvm/scripts/rvm'.
#You can find the RVM location with the rvm info command.
task :environment do
  invoke :'rvm:use', 'ruby-2.4.0@default'
end
```

By default, Mina will create all folders mentioned in shared_dirs and shared_files. In setup, however, you can add section auto-creation of empty files and fill them later.

```ruby
task :setup do
  command %[touch "#{fetch(:shared_path)}/config/database.yml"]
  command %[touch "#{fetch(:shared_path)}/config/secrets.yml"]
  command %[touch "#{fetch(:shared_path)}/config/puma.rb"]
  comment "Be sure to edit '#{fetch(:shared_path)}/config/database.yml', 'secrets.yml' and puma.rb."
end
```

After these actions, you are ready to run Mina setup to prepare all necessary file structures at the remote server.

Your deploy section in deploy.rb should look like this:

```ruby
task :deploy do
  deploy do
    comment "Deploying #{fetch(:application_name)} to #{fetch(:domain)}:#{fetch(:deploy_to)}"
    invoke :'git:clone'
    invoke :'deploy:link_shared_paths'
    invoke :'rvm:load_env_vars'
    invoke :'bundle:install'
    invoke :'rails:db_migrate'
    command %{#{fetch(:rails)} db:seed}
    invoke :'rails:assets_precompile'
    invoke :'deploy:cleanup'

    on :launch do
      invoke :'puma:phased_restart'
    end
  end
end
```

## Puma Setup

Create or fill a puma.rb file in a config folder.

```ruby
environment "production"

bind  "unix:///{path_to_your_app}/shared/tmp/sockets/puma.sock"
pidfile "/{path_to_your_app}/shared/tmp/pids/puma.pid"
state_path "/{path_to_your_app}/shared/tmp/sockets/puma.state"
directory "/{path_to_your_app}/current"

workers 2
threads 1,2

daemonize true

activate_control_app 'unix:///{path_to_your_app}/shared/tmp/sockets/pumactl.sock'

prune_bundler
```

You must point a path to pumactl.sock at activate_control_app. Otherwise, Mina puma:stop and restart will not work.

## Fill database.yml and secrets.yml

Go to the shared folder and make sure that you fill these two files.

## Setup nginx

Create file myapp.conf in a /nginx/etc/conf.d folder with similar content.

```nginx
upstream mysite {
  server unix:///home/admin/mysite/shared/tmp/sockets/puma.sock fail_timeout=0;
}

server {
  listen 80;
  listen [::]:80;

  server_name mysite.com;
  root /home/admin/mysite/current/public;

  location ~ ^/assets/ {
    expires max;
    gzip_static on;
    gzip_vary on;
    add_header Cache-Control public;
    break;
  }


  location / {
    proxy_pass http://mysite;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  }

  location ~ ^/(500|404|422).html {
    root /home/admin/mysite/current/public;
  }

  error_page 500 502 503 504 /500.html;
  error_page 404 /404.html;
  error_page 422 /422.html;

  client_max_body_size 4G;
  keepalive_timeout 10;
}
```

## Generate ssh keys

Generate new ssh keys on your server by using that command ssh-keygen. Then, export it to the deploys keys of your github/bitbucket project.

## Mission Completed

That’s it. Now you’re ready to deploy your application. Run mina deploy if you have already executed mina setup and wait.

## Troubleshooting

If you have problems on git clone, check that you have exported ssh pub key to your repository, and try to clone the repository directly from the server.

Use Mina puma:start on first launch instead of phased_restart.

## Useful Links

[Mina and multi-stages](https://github.com/mina-deploy/mina/blob/2608e50049cf21b1425c8bb7c3e5dd0e964b725f/docs/cookbook.md)
