---
title: <% tp.file.title %>
permalink: "fr/posts/<% tp.file.title.split(" ").join("-").toLowerCase() %>.html"
date: <% tp.date.now("YYYY-MM-DD") %>T<% tp.date.now("HH:mmZZ") %>
slug: <% tp.file.title.split(" ").join("-").toLowerCase() %>
layout: book
lang: fr
author: haclong

book: 
  key: <% tp.file.title.split(" ").join("-").toLowerCase() %>
  next:
    url: "first-post-in-book-permalink"
    title: "first-post-in-book-title"

tags:
  - "happy new year"
  - "resolutions"
  - "coding"
  - "next"

sites:
  - "Développement"
  - "Haclong projects"

summary: "Mon résumé"
<% tp.file.rename( tp.file.title.split(" ").join("-").toLowerCase()) %>
---
