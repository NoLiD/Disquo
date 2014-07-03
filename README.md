Disquo
======

Data comparator for humans.

TODO
====

Tasks listed per file below.

### index.html

In HTML, define our major UI elements.  There will be **static** and **dynamic** elements.

**Static** elements persist throughout application usage.  They may become [hidden/unhidden](http://www.w3schools.com/css/css_display_visibility.asp), or change in other ways, but they are never *deleted* from the content.

**Dynamic** elements can be thought of as nested within static elements.  They are generated from data received by servers, and deleted as necessary.

In the set of lists below, static elements have a normal style and `dynamic elements are codeblocked`:

- [X] content root
    - [ ] endpoint selection bar
    - [X] selected tag bar
    - [X] type selection pane
    - [X] entity selection pane
    - [X] visual comparison pane

- [ ] endpoint selection bar
    - [ ] endpoint input
    - [ ] endpoint select button

- [X] selected tag bar
    - [X] list of selection tag

- [X] selection tag
    - [X] `type/entity name`
    - [X] deselect button 
    - [ ] item descriptor tooltip

- [X] type selection pane
    - [X] list of rdf:type items
    - [ ] page navigator

- [X] entity selection pane
    - [ ] list of entity items
    - [ ] page navigator

- [x] visual comparison pane
    - [X] `title for predicate or value view mode`
    - [ ] visual graph svg
    - [ ] ? **TODO**

- [ ] rdf:type (or rdf:entity) list item
    - [ ] spanify as `.label` for rdfs:label string container
    - [ ] classify as `.type or .entity`
    - [ ] item descriptor tooltip

- [ ] item descriptor tooltip
    - [ ] lable string as tooltip title (CURRENTLY NOT WRAPPING)
    - [X] `URI string container`
    - [X] `rdfs:comment string container`

- [ ] page navigator
    - [ ] `page n/N display container`
    - [ ] next and previous page button

- [ ] visual graph canvas
    - ? **TODO**

### stylesheet.css

- [ ] convert hover after to hover + div.tip
