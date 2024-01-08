import {Probot} from "probot";
import {handleIssueLabels, handleIssueLabelsOnCommentEvent} from "./handlers";



export = (app: Probot) => {
    app.on("issues.opened", handleIssueLabels);
    app.on("issues.reopened", handleIssueLabels);
    app.on("issues.edited", handleIssueLabels);
    app.on("issues.assigned", handleIssueLabels);
    app.on("issues.transferred", handleIssueLabels);
    app.on("issue_comment.created", handleIssueLabelsOnCommentEvent);
};
