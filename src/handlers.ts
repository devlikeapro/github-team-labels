import {Context} from "probot";
import {getFirstSuitableLabel} from "./utils";
import {getConfig} from "./config";


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

/**
 * Add a badge to the issue comment at the end of the comment text
 * @param context
 */
export async function handleIssueCommentAddBadge(context: Context<'issue_comment.created'> | Context<'issue_comment.edited'>) {
    const config = await getConfig(context);
    const createdByUser = context.payload.comment.user
    const orgName = context.payload.repository.owner.login
    const teamLabel = await getFirstSuitableLabel(context.octokit, config, orgName, createdByUser.login, [])
    if (!teamLabel) {
        return;
    }
    const badge = teamLabel.comment
    if (!badge) {
        return;
    }
    const commentBody = context.payload.comment.body
    if (commentBody.includes(badge)) {
        return;
    }
    const newCommentBody = commentBody + "\n\n"  + badge
    const commentId = context.payload.comment.id
    await context.octokit.issues.updateComment(context.issue({comment_id: commentId, body: newCommentBody}))
}
