import {Context} from "probot";
import {getFirstSuitableLabel} from "./utils";
import {getConfig} from "./config";


export async function handleIssueLabels(context: Context<'issues'>) {
    const config = await getConfig(context);
    const createdByUser = context.payload.issue.user
    const orgName = context.payload.repository.owner.login
    const currentLabels = context.payload.issue.labels?.map(label => label.name) || []
    const teamLabel = await getFirstSuitableLabel(context.octokit, config, orgName, createdByUser.login, currentLabels)
    if (teamLabel) {
        const label = teamLabel.label
        await context.octokit.issues.addLabels(context.issue({labels: [label]}))
    }
}

export async function handleIssueLabelsOnCommentEvent(context: Context<'issue_comment'>) {
    // @ts-ignore
    await handleIssueLabels(context)
}
