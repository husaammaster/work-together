"use strict"

import {getProjectByIdPromise} from './crud.js';
import dom from './dom.js';
import elements from './elements.js';
import {deleteProject, getHelperList, joinProject, leaveProject, getCommentList, newComment, deleteComment} from './crud.js';

// parse URL parameters and open the project with the given id
const urlParams = new URLSearchParams(window.location.search);
const projectId = urlParams.get('id');
const nutzer = urlParams.get('nutzer');

console.log("URL Parameter: projectId = " + projectId + ", nutzer = " + nutzer);

elements.elMain = document.querySelector('main');
elements.elNutzername = document.querySelector('#nutzername');
elements.elNutzername.value = nutzer;
elements.elNutzername.addEventListener('change', () => {
    window.location.href = `project_page.html?id=${projectId}&nutzer=${elements.elNutzername.value}`;
});

getProjectByIdPromise(projectId).then(project => {
    createElProjectPage(project, nutzer == project.nutzer);
});
    

const createElHelferListe = (projectDoc, parent, my_project = false) => {
    const elContainer = dom.create({
        tagName: 'div',
        cssClassName: 'helper-list',
        parent: parent,
    });
    const elTitle = dom.create({
        tagName: 'h3',
        content: 'Helferliste',
        cssClassName: 'helper-list__title',
        parent: elContainer,
    });
    const elListe = dom.create({
        tagName: 'ul',
        cssClassName: 'helper-list__items',
        parent: elContainer,
    });
    projectDoc.helfer = getHelperList(projectDoc._id)
    .then(result => {
        result.docs.map(helfer => {
            const elItem = dom.create({
                tagName: 'li',
                content: helfer.helper,
                cssClassName: 'helper-list__item',
                parent: elListe,
            });
            if (helfer.helper === elements.elNutzername.value) {
                const elDeleteButton = dom.create({
                    tagName: 'button',
                    content: 'Verlassen',
                    cssClassName: 'button button--leave',
                    parent: elItem,
                    listeners: {
                        click: () => {
                            leaveProject(projectDoc._id, elements.elNutzername.value);
                            window.location.href = `project_page.html?id=${projectId}&nutzer=${elements.elNutzername.value}`;
                        }
                    },
                });
            }

            let color = "black"
            if (result.docs.length == projectDoc.maxHelpers)
                color = "limegreen"
            else if (result.docs.length < projectDoc.maxHelpers/4)
                color = "red"
            else if (result.docs.length < projectDoc.maxHelpers/2)
                color = "orange"
            else if (result.docs.length > projectDoc.maxHelpers)
                color = "lightgray"
            document.querySelector('.project__helper-count').innerHTML = "Anzahl gesuchter Helfer: "  + result.docs.length + " / " + projectDoc.maxHelpers;
            document.querySelector('.project__helper-count').style.color = color;
        })
        if (!my_project) {
            const elBeitreten = dom.create({
                tagName: 'button',
                content: 'Beitreten',
                cssClassName: 'button button--join',
                parent: elListe,
                listeners: {
                    click: () => {
                        joinProject(projectDoc._id, nutzer);
                        window.location.href = `project_page.html?id=${projectId}&nutzer=${elements.elNutzername.value}`;
                    }
                },
            });
        }
    });

    return elContainer;
}

const createElCommentList = (projectDoc, elProject) => {
    const elContainer = dom.create({
        tagName: 'div',
        cssClassName: 'comment-list',
        parent: elProject,
    });
    const elTitle = dom.create({
        tagName: 'h3',
        content: 'Kommentare',
        cssClassName: 'comment-list__title',
        parent: elContainer,
    }); 

    const elCommentList = dom.create({
        tagName: 'ul',
        cssClassName: 'comment-list__items',
        parent: elContainer,
    });
    projectDoc.comments = getCommentList(projectDoc._id)
    .then(result => {
        result.docs.map(comment => {
            const elItem = dom.create({
                tagName: 'li',
                cssClassName: 'comment-list__item',
                parent: elCommentList,
            });
            const elHeader = dom.create({
                tagName: 'div',
                cssClassName: 'comment-list__item-header',
                parent: elItem,
            });
            const elUser = dom.create({
                tagName: 'p',
                content: comment.user,
                cssClassName: 'comment-list__user',
                parent: elHeader,
            }); 

            if (comment.user === elements.elNutzername.value) {
                const elDeleteButton = dom.create({
                    tagName: 'button',
                    content: 'Löschen',
                    cssClassName: 'button button--delete',
                    parent: elHeader,
                    listeners: {
                        click: () => {
                            deleteComment(comment._id, comment._rev)
                            .then(() => {
                                elContainer.innerHTML = '';
                                createElCommentList(projectDoc, elProject);
                            });
                            // window.location.href = `project_page.html?id=${projectId}&nutzer=${elements.elNutzername.value}`;
                        }
                    },
                });
            }
            if (comment.user == projectDoc.nutzer) {
                const elOwnerBadge = dom.create({
                    tagName: 'span',
                    content: 'Projektleiter',
                    cssClassName: 'comment-list__owner-badge',
                    parent: elHeader,
                });
            }
            const elTimestamp = dom.create({
                tagName: 'p',
                content: new Date(comment.timestamp).toLocaleString("de-DE", { dateStyle: "short", timeStyle: "short" }),
                cssClassName: 'comment-list__timestamp',
                parent: elHeader,
            });
            const elComment = dom.create({
                tagName: 'p',
                content: comment.comment,
                cssClassName: 'comment-list__content',
                parent: elItem,
            });
        })
    })
    const elNewCommentInput = dom.create({
        tagName: 'textarea',
        cssClassName: 'comment-list__input',
        parent: elContainer,
        listeners: {
            keydown: (event) => {
                if (event.key === 'Enter') {
                    newComment(projectDoc._id, elNewCommentInput.value, elements.elNutzername.value, Date.now())
                    .then(() => {
                        elContainer.innerHTML = '';
                        createElCommentList(projectDoc, elProject);
                    });
                    elNewCommentInput.value = '';
                    // window.location.href = `project_page.html?id=${projectId}&nutzer=${elements.elNutzername.value}`;
                }
            }
        }
    });
    const elNewCommentButton = dom.create({
        tagName: 'button',
        content: 'Neuer Kommentar',
        cssClassName: 'button button--submit',
        parent: elContainer,
        listeners: {
            click: () => {
                newComment(projectDoc._id, elNewCommentInput.value, elements.elNutzername.value, Date.now())
                .then(() => {
                    elContainer.innerHTML = '';
                    createElCommentList(projectDoc, elProject);
                });
                elNewCommentInput.value = '';
                // window.location.href = `project_page.html?id=${projectId}&nutzer=${elements.elNutzername.value}`;
            },
        },
    });
    return elContainer;
} 

const createElProjectPage = (projectDoc, my_project = false) => {
    let elProject = dom.create({
        tagName: 'div',
        cssClassName: 'project',
        parent: elements.elMain,
    });
    let elHeader = dom.create({
        tagName: 'div',
        cssClassName: 'project__header',
        parent: elProject,
    });
    let elLink = dom.create({
        tagName: 'a',
        cssClassName: 'project__link',
        href: `project_page.html?id=${projectDoc._id}&nutzer=${elements.elNutzername.value}`,
        parent: elHeader,
    });
    let elTitle = dom.create({
        tagName: 'h2',
        content: projectDoc.proj_name,
        cssClassName: 'project__title',
        parent: elLink,
    });

    let elUser = dom.create({
        tagName: 'h5',
        content: "Projekt von: " + projectDoc.nutzer,
        cssClassName: 'project__user' + (my_project ? ' project__user--owner' : ''),
        parent: elHeader,
    });
    if (my_project) {
        let elDeleteButton = dom.create({
            tagName: 'button',
            content: "Löschen und zurück zu Home",
            cssClassName: 'button button--delete',
            parent: elHeader,
            listeners: {
                click: () => {deleteProject(projectDoc._id, projectDoc._rev).then(
                    () => window.location.href = "index.html"
                    ).catch(
                        console.warn
                    )
                }
            }
        });
    }
    let elDescription = dom.create({
        tagName: 'p',
        content: projectDoc.description,
        cssClassName: 'project__description',
        parent: elProject,
    });
    let elMaxHelpers = dom.create({
        tagName: 'p',
        content: "Anzahl gesuchter Helfer: " + projectDoc.maxHelpers,
        cssClassName: 'project__helper-count',
        parent: elProject,
    });
    createElHelferListe(projectDoc, elProject, my_project);



    let elListe = dom.create({
        tagName: 'h3',
        content: "Liste der Materialien: ",
        cssClassName: 'project__materials-title',
        parent: elProject,
    });
    let elItems = dom.create({
        tagName: 'ul',
        cssClassName: 'project__materials-list',
        parent: elProject,
    });
    projectDoc.items.map(item => {
        let elItem = dom.create({
            tagName: 'li',
            content: item,
            cssClassName: 'project__material-item',
            parent: elItems,
        });
    });

    createElCommentList(projectDoc, elProject);
}