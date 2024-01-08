import {Context} from "probot";
import {getConfig, GHTeamLabel} from "../config";
import {getFirstSuitableLabel} from "../utils";

export async function handleIssueCommentAddBadge(context: Context<'issue_comment'>) {
    const config = await getConfig(context);
    const createdByUser = context.payload.comment.user
    const orgName = context.payload.repository.owner.login
    const teamLabel = await getFirstSuitableLabel(context.octokit, config, orgName, createdByUser.login, [])
    const body = context.payload.comment.body;
    const newBody = upsertBadge(body, teamLabel)
    if (body === newBody) {
        return;
    }
    const commentId = context.payload.comment.id
    await context.octokit.issues.updateComment(context.issue({comment_id: commentId, body: newBody}))
}

export async function handleIssueAddBadge(context: Context<'issues'>) {
    const config = await getConfig(context);
    const createdByUser = context.payload.issue.user
    const orgName = context.payload.repository.owner.login
    const teamLabel = await getFirstSuitableLabel(context.octokit, config, orgName, createdByUser.login, [])
    const body = context.payload.issue.body || ""
    const newBody = upsertBadge(body, teamLabel)
    if (body === newBody) {
        return;
    }
    await context.octokit.issues.update(context.issue({body: newBody}))
}

export async function handlePullRequestAddBadge(context: Context<'pull_request'>) {
    const config = await getConfig(context);
    const createdByUser = context.payload.pull_request.user
    const orgName = context.payload.repository.owner.login
    const teamLabel = await getFirstSuitableLabel(context.octokit, config, orgName, createdByUser.login, [])
    const body = context.payload.pull_request.body || ""
    const newBody = upsertBadge(body, teamLabel)
    if (body === newBody) {
        return;
    }
    await context.octokit.issues.update(context.issue({body: newBody}))
}

function upsertBadge(body: string, teamLabel: GHTeamLabel | null) {
    if (!teamLabel) {
        return body;
    }
    const badge = teamLabel.comment
    if (!badge) {
        return body;
    }
    if (body.includes(badge)) {
        return body;
    }
    return body + "\n\n" + badge
}
