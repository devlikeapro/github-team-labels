import {Probot} from "probot";
import {handleIssueCommentAddBadge, handleIssueLabels, handleIssueLabelsOnCommentEvent} from "./handlers";



export = (app: Probot) => {
    // Comments content
    app.on("issue_comment.created", handleIssueCommentAddBadge);
    app.on("issue_comment.edited", handleIssueCommentAddBadge);
    // Labels
    app.on("issues.opened", handleIssueLabels);
    app.on("issues.reopened", handleIssueLabels);
    app.on("issues.edited", handleIssueLabels);
    app.on("issues.assigned", handleIssueLabels);
    app.on("issues.transferred", handleIssueLabels);
    app.on("issue_comment.created", handleIssueLabelsOnCommentEvent);
};
