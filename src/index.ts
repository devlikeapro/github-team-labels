import {Probot} from "probot";
import {handleIssueLabels, handleIssueLabelsOnCommentEvent} from "./handlers";



export = (app: Probot) => {
    app.on("issues", handleIssueLabels);
    app.on("issue_comment", handleIssueLabelsOnCommentEvent);
};
