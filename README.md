Disquo
======

Data comparator for humans.

TODO
====

- in both html and css, make consistent the ids and classes
    - no camelCase (readability)
    - no dashes (javascript compliance>
    - all underscores

### index.html

- [X] content root
    - [X] endpoint selection bar
    - [X] selected tag bar
    - [X] type selection pane
    - [X] entity selection pane
    - [X] visual comparison pane

- [X] endpoint selection bar
    - [X] endpoint input
    - [X] endpoint select button

- [X] selected tag bar
    - [X] list of selection tag

- [X] selection tag
    - [X] `type/entity name`
    - [X] deselect button 
    - [X] item descriptor tooltip

- [X] type selection pane
    - [X] list of rdf:type items
    - [ ] page navigator

- [X] entity selection pane
    - [X] list of entity items
    - [ ] page navigator

- [x] visual comparison pane
    - [X] `title for predicate or value view mode`
    - [ ] visual graph svg
    - [ ] ? **TODO**

- [X] rdf:type (or rdf:entity) list item
    - [x] classify as `.type or .entity`
    - [X] item descriptor tooltip

- [X] item descriptor tooltip
    - [X] label string as tooltip title (CURRENTLY NOT WRAPPING)
    - [X] `URI string container`
    - [X] `rdfs:comment string container`

- [ ] page navigator
    - [ ] `page n/N display container`
    - [ ] next and previous page button

- [ ] visual graph canvas
    - ? **TODO**

### stylesheet.css

- [ ] convert hover after to hover + div.tip
