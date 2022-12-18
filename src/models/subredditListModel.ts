import { Flair, SubredditAbout } from './redditAPIModel';

import { Required } from '@tsed/schema';

export class AddSubredditPayload {
    @Required()
    subredditName: string;

    @Required()
    categoryName: string;
}

export class DeleteSubredditPayload {
    @Required()
    subredditName: string;

    @Required()
    categoryName: string;
}

export interface SubredditInfo extends SubredditAbout {
    flairs: Flair[];
    notes: string[];
}

export interface SubredditCategory {
    categoryName: string;
    subreddits: SubredditInfo[];
}