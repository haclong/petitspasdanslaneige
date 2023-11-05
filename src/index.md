--- 
# cette page fait une bidouille dans des directives frontmatter 
# pour rediriger l'URL / vers /fr
pagination:
  data: redirects
  size: 1
  alias: redirect
redirects:
  - {"from": "/", "to": "/fr/index0.html"}
permalink: "index.html"
layout: redirect.njk
---

on ne peut pas voir ce contenu parce que c'est une redirection vers la page home française