import {Context} from "probot";
import {getFirstSuitableLabel} from "./utils";
import {getConfig, GHTeamLabel} from "./config";

//
// Labels
//

export async function handleIssueLabels(context: Context<'issues'>) {
    const config = await getConfig(context);
    const createdByUser = context.payload.issue.user
    const orgName = context.payload.repository.owner.login
    const currentLabels = context.payload.issue.labels?.map(label => label.name) || []
    const teamLabel = await getFirstSuitableLabel(context.octokit, config, orgName, createdByUser.login, currentLabels)
    if (!teamLabel) {
        return;
    }

    const label = teamLabel.label
    await context.octokit.issues.addLabels(context.issue({labels: [label]}))
}

export async function handleIssueLabelsOnCommentEvent(context: Context<'issue_comment'>) {
    // @ts-ignore
    await handleIssueLabels(context)
}

//
// Badges
//

export async function handleIssueCommentAddBadge(context: Context<'issue_comment.created'> | Context<'issue_comment.edited'>) {
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
    const currentLabels = context.payload.issue.labels?.map(label => label.name) || []
    const teamLabel = await getFirstSuitableLabel(context.octokit, config, orgName, createdByUser.login, currentLabels)
    const body = context.payload.issue.body || ""
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
