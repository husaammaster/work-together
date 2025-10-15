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
        cssClassName: 'helferliste',
        parent: parent,
        styles: {
            margin: '20px 0 0 0',
        }
    });
    const elTitle = dom.create({
        tagName: 'h3',
        content: 'Helferliste',
        parent: elContainer,
    });
    const elListe = dom.create({
        tagName: 'ul',
        cssClassName: 'helferliste',
        parent: elContainer,
    });
    projectDoc.helfer = getHelperList(projectDoc._id)
    .then(result => {
        result.docs.map(helfer => {
            const elItem = dom.create({
                tagName: 'li',
                content: helfer.helper,
                cssClassName: 'helfer',
                parent: elListe,
            });
            if (helfer.helper === elements.elNutzername.value) {
                const elDeleteButton = dom.create({
                    tagName: 'button',
                    content: 'Verlassen',
                    cssClassName: 'verlassen',
                    parent: elItem,
                    listeners: {
                        click: () => {
                            leaveProject(projectDoc._id, elements.elNutzername.value);
                            window.location.href = `project_page.html?id=${projectId}&nutzer=${elements.elNutzername.value}`;
                        }
                    },
                    styles: {
                        backgroundColor: 'coral',
                        margin: '0 0 0 10px',
                        color: 'white',
                        cursor: 'pointer',
                    }
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
            document.querySelector('.maxHelpers').innerHTML = "Anzahl gesuchter Helfer: "  + result.docs.length + " / " + projectDoc.maxHelpers;
            document.querySelector('.maxHelpers').style.color = color;
        })
        if (!my_project) {
            const elBeitreten = dom.create({
                tagName: 'button',
                content: 'Beitreten',
                cssClassName: 'beitreten',
                parent: elListe,
                listeners: {
                    click: () => {
                        joinProject(projectDoc._id, nutzer);
                        window.location.href = `project_page.html?id=${projectId}&nutzer=${elements.elNutzername.value}`;
                    }
                },
                styles: {
                    backgroundColor: 'lightblue',
                    color: 'white',
                    cursor: 'pointer',
                }
            });
        }
    });

    return elContainer;
}

const createElCommentList = (projectDoc, elProject) => {
    const elContainer = dom.create({
        tagName: 'div',
        cssClassName: 'commentListContainer',
        parent: elProject,
        styles: {
            margin: '20px 0 0 0',
        }
    });
    const elTitle = dom.create({
        tagName: 'h3',
        content: 'Kommentare',
        cssClassName: 'commentListTitle',
        parent: elContainer,
    }); 

    const elCommentList = dom.create({
        tagName: 'ul',
        cssClassName: 'commentList',
        parent: elContainer,
    });
    projectDoc.comments = getCommentList(projectDoc._id)
    .then(result => {
        result.docs.map(comment => {
            const elItem = dom.create({
                tagName: 'li',
                cssClassName: 'comment',
                parent: elCommentList,
            });
            const elHeader = dom.create({
                tagName: 'div',
                cssClassName: 'commentHeader',
                parent: elItem,
                styles: {
                    display: 'flex',
                    justifyContent: 'space-between',
                }
            });
            const elUser = dom.create({
                tagName: 'p',
                content: comment.user,
                parent: elHeader,
                styles: {
                    color: 'gray',
                    fontWeight: 'bold',
                }
            }); 

            if (comment.user === elements.elNutzername.value) {
                const elDeleteButton = dom.create({
                    tagName: 'button',
                    content: 'Löschen',
                    cssClassName: 'deleteComment',
                    parent: elHeader,
                    listeners: {
                        click: () => {
                            deleteComment(comment._id, comment._rev);
                            window.location.href = `project_page.html?id=${projectId}&nutzer=${elements.elNutzername.value}`;
                        }
                    },
                    styles: {
                        backgroundColor: 'coral',
                        margin: '0 0 0 10px',
                        color: 'white',
                        cursor: 'pointer',
                    }
                });
            }
            if (comment.user == projectDoc.nutzer) {
                const elOwnerBadge = dom.create({
                    tagName: 'span',
                    content: 'Projektleiter',
                    cssClassName: 'ownerBadge',
                    parent: elHeader,
                    styles: {
                        backgroundColor: 'lightblue',
                        color: 'white',
                        borderRadius: '5px',
                        padding: '2px 5px',
                    }
                });
            }
            const elTimestamp = dom.create({
                tagName: 'p',
                content: new Date(comment.timestamp).toLocaleString("de-DE", { dateStyle: "short", timeStyle: "short" }),
                parent: elHeader,
                styles: {
                    color: 'gray',
                    fontWeight: 'bold',
                }
            });
            const elComment = dom.create({
                tagName: 'p',
                content: comment.comment,
                parent: elItem,
                styles: {
                    margin: '0 0 0 10px',
                }
            });
        })
    })
    const elNewCommentInput = dom.create({
        tagName: 'textarea',
        cssClassName: 'newCommentInput',
        parent: elContainer,
        styles: {
            width: '80%',
            height: '100px',
            margin: '0 0 0 10px',
        },
        listeners: {
            keydown: (event) => {
                if (event.key === 'Enter') {
                    newComment(projectDoc._id, elNewCommentInput.value, elements.elNutzername.value, Date.now());
                    elNewCommentInput.value = '';
                    window.location.href = `project_page.html?id=${projectId}&nutzer=${elements.elNutzername.value}`;
                }
            }
        }
    });
    const elNewCommentButton = dom.create({
        tagName: 'button',
        content: 'Neuer Kommentar',
        cssClassName: 'newCommentButton',
        parent: elContainer,
        listeners: {
            click: () => {
                newComment(projectDoc._id, elNewCommentInput.value, elements.elNutzername.value, Date.now());
                elNewCommentInput.value = '';
                window.location.href = `project_page.html?id=${projectId}&nutzer=${elements.elNutzername.value}`;
            },
        },
        styles: {
            backgroundColor: 'lightblue',
            color: 'white',
            cursor: 'pointer',
            margin: '0 0 0 10px',
        }
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
        styles: {
            display: 'flex',
            justifyContent: 'space-between',
        },
        parent: elProject,
    });
    let elLink = dom.create({
        tagName: 'a',
        href: `project_page.html?id=${projectDoc._id}&nutzer=${elements.elNutzername.value}`,
        styles: {
            cursor: 'pointer',
            textDecoration: 'none',
            color: 'inherit'
        },
        parent: elHeader,
    });
    let elTitle = dom.create({
        tagName: 'h2',
        content: projectDoc.proj_name,
        cssClassName: 'title',
        parent: elLink,
    });

    let my_style = {}
    if (my_project) {
        my_style = {
            backgroundColor: 'lightblue',
        }
    }
    let elUser = dom.create({
        tagName: 'h5',
        content: "Projekt von: " + projectDoc.nutzer,
        cssClassName: 'user',
        parent: elHeader,
        styles: my_style,
    });
    if (my_project) {
        let elDeleteButton = dom.create({
            tagName: 'button',
            content: "Löschen und zurück zu Home",
            cssClassName: 'del_project',
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
        cssClassName: 'description',
        parent: elProject,
    });
    let elMaxHelpers = dom.create({
        tagName: 'p',
        content: "Anzahl gesuchter Helfer: " + projectDoc.maxHelpers,
        cssClassName: 'maxHelpers',
        parent: elProject,
    });
    createElHelferListe(projectDoc, elProject, my_project);



    let elListe = dom.create({
        tagName: 'h3',
        content: "Liste der Materialien: ",
        cssClassName: 'itemTitle',
        parent: elProject,
        styles: {
            margin: '20px 0 0 0',
        }
    });
    let elItems = dom.create({
        tagName: 'ul',
        cssClassName: 'itemList',
        parent: elProject,
    });
    projectDoc.items.map(item => {
        let elItem = dom.create({
            tagName: 'li',
            content: item,
            cssClassName: 'item',
            parent: elItems,
        });
    });

    createElCommentList(projectDoc, elProject);
}