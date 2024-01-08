import {Probot} from "probot";
import {
    handleDiscussionAddBadge,
    handleIssueAddBadge,
    handleIssueCommentAddBadge,
    handlePullRequestAddBadge
} from "./handlers/badges";
import {handleIssueLabels, handleIssueLabelsOnCommentEvent, handlePullRequestLabels} from "./handlers/labels";



export = (app: Probot) => {
    // Badges
    app.on("issues.opened", handleIssueAddBadge);
    app.on("issues.edited", handleIssueAddBadge);
    app.on("issue_comment.created", handleIssueCommentAddBadge);
    app.on("issue_comment.edited", handleIssueCommentAddBadge);
    app.on("pull_request.opened", handlePullRequestAddBadge);
    app.on("pull_request.edited", handlePullRequestAddBadge);
    app.on("discussion.created", handleDiscussionAddBadge);
    app.on("discussion.edited", handleDiscussionAddBadge);
    // Labels
    app.on("issues.opened", handleIssueLabels);
    app.on("issues.reopened", handleIssueLabels);
    app.on("issues.edited", handleIssueLabels);
    app.on("issues.assigned", handleIssueLabels);
    app.on("issues.transferred", handleIssueLabels);
    app.on("issue_comment.created", handleIssueLabelsOnCommentEvent);
    app.on("pull_request.opened", handlePullRequestLabels);
    app.on("pull_request.edited", handlePullRequestLabels);
};
