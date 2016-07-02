# <%= title %>

{% body %}

<%= hasAny([related.doc, related.api, related.url], '## Related') %>
<%= hasValue(related.doc, '**Docs**') %>
<%= links(related, 'doc') %>

<%= hasValue(related.api, '**API**') %>
<%= links(related, 'api') %>

<%= hasValue(related.url, '**Links**') %>
<%= links(related, 'url') %>