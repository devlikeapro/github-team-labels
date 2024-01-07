import {Context} from "probot";
import {getFirstSuitableLabel} from "./utils";
import {getConfig} from "./config";


export async function handleIssue(context: Context<'issues'>) {
    const config = await getConfig(context);
    if (!config) {
        return
    }
    const createdByUser = context.payload.issue.user
    const orgName = context.payload.repository.owner.login
    const currentLabels = context.payload.issue.labels?.map(label => label.name) || []
    const label: string | null = await getFirstSuitableLabel(context.octokit, config, orgName, createdByUser.login, currentLabels)
    if (label) {
        await context.octokit.issues.addLabels(context.issue({labels: [label]}))
    }
}
