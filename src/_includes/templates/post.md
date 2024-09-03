---
title: <% tp.file.title %>
permalink: "fr/posts/<% tp.file.title.split(" ").join("-").toLowerCase() %>.html"
date: <% tp.date.now("YYYY-MM-DD") %>T<% tp.date.now("HH:mmZZ") %>
slug: <% tp.file.title.split(" ").join("-").toLowerCase() %>
layout: post
lang: fr
author: haclong

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
