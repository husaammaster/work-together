"use strict"

import nano from "nano";
import credentials from './credentials.json' with {type: 'json'};

export const dbNames = {
    a_projects: 'a_projects', // just properties of the project
    a_users: 'a_users', // just properties of the user
    a_comments: 'a_comments', // just properties of the comment

    b_proj_owner_user_rel: 'b_proj_owner_user_rel', // project owner user relationship
    b_comment_owner_user_rel: 'b_comment_owner_user_rel', // comment owner user relationship
    b_proj_comment_rel: 'b_proj_comment_rel', // project comment relationship
    b_proj_helper_user_rel: 'b_proj_helper_user_rel', // project helper user relationship
}

export const dbScope = nano(`http://${credentials.user}:${credentials.pw}@${credentials.url}`).db;


export const init = () => {
    return dbScope.list().then(
        dbs => {
            for(let dbName of Object.values(dbNames)) {
                if (!dbs.includes(dbName)) {
                    dbScope.create(dbName);
                }
            }
        }
    ).then(
        () => console.log('Datenbanken initialisiert')
    )
    
}

