'use strict'

import elements from "./elements.js";

const dom = {
    create({
        content = false,
    	value = false,
    	tagName = 'div',
    	type = false,
    	parent = false,
    	name = false,
    	src = false,
    	href = false,
    	id = false,
    	target = false,
    	cssClassName = false,
    	cssClasses = [],
    	attr = {},
    	listeners = {},
    	styles = {},
    	insert = 'append',
    } = {}) {
        let neu = document.createElement(tagName);
    	if (content) neu.innerHTML = content;
    	if (name) neu.setAttribute('name', name);
    	if (src) neu.setAttribute('src', src);
    	if (href) neu.setAttribute('href', href);
    	if (target) neu.setAttribute('target', target);
    	if (id) neu.setAttribute('id', id);
    	if (type) neu.setAttribute('type', type);
    	if (value) neu.setAttribute('value', value);
    	if (cssClassName) neu.className = cssClassName;
    	if (cssClasses.length) neu.classList.add(...cssClasses);

    	Object.entries(attr).forEach(el => neu.setAttribute(...el));
    	Object.entries(listeners).forEach(el => neu.addEventListener(...el));
    	Object.entries(styles).forEach(([key, value]) => neu.style[key] = value);

    	if (parent) {
    	    if (insert == 'append') {
    		    parent.append(neu);
    		} else if (insert == 'prepend') {
    			parent.prepend(neu);
    		} else if (insert == 'before') {
    		    parent.before(neu);
    		} else if (insert == 'after') {
    		    parent.after(neu);
    		}
    	}

    	return neu;
    },
    mapping(){
        elements.main = document.querySelector('main');
    }
}

export default dom;