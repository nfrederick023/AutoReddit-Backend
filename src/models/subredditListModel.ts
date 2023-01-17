import { Required } from '@tsed/schema';

export class AddSubredditPayload {
    @Required()
    public readonly subredditName!: string;

    @Required()
    public readonly categoryName!: string;
}

export class DeleteSubredditPayload {
    @Required()
    public readonly subredditNames!: string[];
}