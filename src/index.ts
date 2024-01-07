import {Probot} from "probot";
import {handleIssue, handleIssueComment} from "./handlers";



export = (app: Probot) => {
    app.on("issues", handleIssue);
    app.on("issue_comment", handleIssueComment);
};
