---
title: 'Oh Man, Look at Your API!'
summary: Tips for building a great API that any developer might find useful in his daily job.
author: Alexey Kuznetsov
cover: cover.jpg
category: Development
---

Here’s my small effort to make the world a better place. It could be useful for those of us on the way to building your own super duper API or who have the patience to improve on an existing one. These tips are based on my own painful experience with APIs I’ve worked with. Some API made me hate them, others trained my intuition or even helped me developed something like a kind of paranormal ability. Still others made me break down with hysterical laughter. As you can see there’s a lot to go over, so let’s get started!

## Good API is boring. No exceptions

You shouldn’t try to invent anything new here. The system behaviour should be the same everywhere and at every stage. It works for both the principles of API endpoint construction and input/output data formats. You need boring, standard API error messages and request/response headers. Fields with every data type should always have the same output and input formats. All empty fields should look the same. Programming your API process is very similar to lying; the more you have built up around it, the much you (and your clients) have to disentangle later. In other words, the more boring you design an API, the more satisfied your clients will be with it.

By the way, this advice is good to keep in mind for the design of your whole information system.

## Documentation

We all know that the most common advice says to document your API but lots of people avoid doing it anyway. While I understand that nobody ever seems to have enough time for these things, it is the face of your API. It might be worth it to put off your much more interesting API coding challenge to invest in writing this documentation. Here are some basic tips for doing it well:

- You should offer always working examples of HTTP requests and responses or of actual working code.
- Documentation should be formatted as consistently as the API itself.
- The foundational principles of your API should be described clearly and in detail.
- Use API frameworks such as Swagger, Apiary or Postman.

**Remember that without good documentation for your super duper API, using it becomes like piecing together a complicated puzzle.**

![Postman API Documentation example](api1.jpeg)

## Errors handling

Even if API has poor documentation, it is possible to get quite far relying only on error messages, if they are good. As a rule, accurate and clear error messages really matter to the user experience. Even for API developers, good error messages make you more confident in your work and help you react to errors quickly.

**Bad error:**

```json
HTTP/1.1 422 Unprocessable Entity{
- “error”: Invalid Attribute
}
```

**Good error:**

```json
HTTP/1.1 422 Unprocessable Entity
Content-Type: application/vnd.api+json{
- "errors": [
- - {
- - - "status": "422",
- - - "source": { "pointer": "/data/attributes/first-name" },
- - - "title": "Invalid Attribute",
- - - "details": "First name must contain min three chars."
- - }
- ]
}
```

## Authorization

Every authorization type is useful if it’s **STANDARDIZED**. Please do not mess around with this! Working on authorization processes becomes a real issue if it’s unique in some way or is too weak. Take the example of OAuth; it was an API that generated a refresh-token on every access-token update, and also needed access token expiry time. In my opinion, that’s too much. First, let your users decide what security level they need and if you can allow non-expiring tokens. Second, keep the processes uncomplicated. Many good APIs use static refresh tokens. Secure is not the same thing as confusing.

## Data formats

Do not even think about constructing new data formats! I’ve seen APIs with custom data formats and they always suck. Parsing of your unique data format slows work down a lot and makes it a chore to do. Sure, I know it is hard to suppress your creativity when it spills out into these strange ideas, and that these are difficult to throw purely because of your own parental feeling towards your creation, but you must resist. We already have JSON, XML and all the rest, right? They are enough.

You should take advantage of specifications like [JSON API](http://jsonapi.org/). Stripe, Braintree and lots of other companies are already using it successfully. JSON looks good, has an easy to use structured data format, and the JSON API spec is generally well thought out.

Also, please do not support multiple data formats. Customers do not generally care which standard data format they use because all programming languages and technologies already support data formatting and parsing for every standard type. Including multiple formats only slows your API and documentation maintenance down.

## Use HTTP status codes

It’s so much fun! It is very confusing for a developer to get inner API errors with HTTP status 200. This really slows down development. And HTTP status codes can fill the error message role in many cases. Common examples include:

```json
200 (OK) — success, handle responded data.
500 (Internal Server Error) — something went wrong, ask for API system technical support.
400 (Bad Request) — wrong API request, check documentation.
401 (Unauthorized) — wrong client credentials, recheck them or if API key token has expired, then refresh.
403 (Forbidden) — unpermitted action, current user does not have enough access rights.
404 (Not Found) — record not found, maybe it doesn’t exist anymore or wrong record ID was used.
405 (Method Not Allowed) — this API method is not allowed anymore.
406 (Not Acceptable) — not acceptable action, probably from attempt to save invalid data.
```

You can check [Wikipedia](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes#4xx_Client_errors) for the rest of the codes and I bet you’ll always find a suitable one.

## Content-type

This is very simple advice. Without any special reason to change it, your content type always should be the same. It helps keep client architecture consistent, and accelerates and simplifies the development process. Also avoid allowing several supported content-types for an endpoint. Developers working with that endpoint could be confused by this. For example, your endpoint “A” works fine but endpoint “B” returns a Bad Request error even though you use it in the same way. Changing your content type doesn’t look like an obvious solution.

## Object structure

From the client’s side of things, it is always very helpful to know what fields the entity actually has. That is perfect if API has a special endpoint that returns a full entity field map. Otherwise, you should at least ensure that you object/list getter returns EVERY field even if it is empty. We don’t need dynamism and brevity here.

```json
{
- "id": "9c7fd1e5-97f0-4b6a-979c-1d7adf5bda16",
- "email": "example@gmail.com",
- "firstname": "John",
- "lastname": "Smith",
- "timezone": null,
- "phone_code": "RU",
- "phone": null,
- "created_at": "2018-03-27T05:40:31.929Z",
- "updated_at": "2018-04-08T09:24:39.683Z",
- "citizenship": null
}
```

## Pagination

When I was working on an API connector for a famous CRM system, I realized that it has NO pagination records. When I asked technical support about this, I was told that “unfortunately, we haven’t included it, but that’s good idea for implementation.” This seemed unbelievable to me. I know that all of you clearly understand why we can’t load all of the data at once, so let me explain what pagination is perfect in my view:

- It’s useful when you can control pagination page size. It enables users to choose for themselves between quantity and quality of requests.
- It has meta information to understand how many records summaries we have. In a case of loading all the records, it really helps to understand progress. Also, records counting doesn’t require loading of every page, let’s not waste time and money.
- The clear and constant naming of pagination variables, for example: page_number — current page number; page_size — pagination step size; pages_total_count — total count of pages.

## Images and files

This might seem obvious, but you shouldn’t include files or image bodies inside responded data. It is much better if you return a temporary upload link.

## Time and date

I want to note that it is really important to explicitly specify what time zone we use. It could be part of the time format or just a phrase in the documentation. How to use timezones deserves a separate article of its own, but to keep things simple for now: You can just return date in integer numbers of seconds since the Unix epoch for the time was converted into a UTC timezone. Every client can handle this to correct their format and timezone.

```json
{
  ...
  "created_at" => article.created_at.utc.to_i
}.to_json #=> { ..., created_at: 1523556863 }
```

## Payment plan

You should use HTTP status codes to inform a client when they try to use payment-required endpoints on a free or “not enough paid” plan. Sometimes it is rather difficult to understand what went wrong, and it wastes time to keep fighting with nothing while trying to choose the correct request format. I suggest using the 402 Payment Required HTTP status code here. You can pick any other code you want but it should be clear what is happening. API documentation should have notes about these using conditions as well.

## API limits

If you programmatically limit request counts in your API, I want to see a clear error message when I have reached the limit. Ideally, there would be a special endpoint with this information. Your customers shouldn’t have to calculate API requests count, you already have that information on your end. It’s a good idea to render information about available API calls in HTTP Response Headers. For example:

```json
X-RateLimit-Limit - Request limit per hour
X-RateLimit-Remaining - The number of requests left for the time window
```

[Example of API Limits in ZohoCRM.](https://www.zoho.eu/crm/help/api/api-limits.html#API_Limit)

## Logical aspect

While developing your API, one really good idea is to put yourself in the client’s seat. You can find lots of helpful things at an early stage this way. For example, I saw in some APIs that when you delete a record twice, you’ll get the same response each time. In my opinion, this is bad because it allows your client to incorrectly believe that they removed it again or removed a different record already. It should return a 404 HTTP status code if the record was already deleted, to help your clients to notice their mistakes.

## Another observation about APIs

In my view, if you have strange API endpoints it may be a sign of something really bad in your project design. So instead of diving into creating facades and adapters, take a break and look around. It is very possible that you will see a good opportunity for a refactoring iteration that will kill two birds with one stone: both simplifying your API interface and improving your project structure.

## Afterword

I want to say huge thanks to all the developers who produce high quality and easy to use APIs. I know that you are very often doing it run by your own conscience and sense of beauty. At first glance, these investments don’t give obvious advantages, but I believe they pay off in the long-term effect by growing clients loyalty. All the best to the diligent workers behind this difficult task!
