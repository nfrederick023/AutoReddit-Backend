import * as jsonfile from 'jsonfile';

import { AddSubredditPayload, DeleteSubredditPayload } from '../models/subredditListModel';

import { Injectable } from '@tsed/di';
import { RedditAPIService } from './redditAPIService';
import { Subreddit } from '../utils/types';

@Injectable()
export class SubredditListService {
    private readonly file = 'src/storage/subreddits.json';
    constructor(private readonly redditAPI: RedditAPIService) { }

    async getSubredditList(): Promise<Subreddit[]> {
        try {
            return await jsonfile.readFileSync(this.file) as Subreddit[];
        } catch (e) {
            // could not read from file. Reset file to and return an empty array
            await this.writeToFile([]);
            throw (e);
        }
    }

    async addSubreddit(payload: AddSubredditPayload): Promise<void> {
        const subredditList = await this.getSubredditList();
        const subreddit = subredditList.find(subreddit => subreddit.name.toLocaleLowerCase() === payload.subredditName.toLocaleLowerCase());

        // if subreddit exsists and has category, return
        if (subreddit?.categories.includes(payload.categoryName)) {
            return;
        }

        // if subreddit exsists, add category 
        if (subreddit) {
            subreddit.categories.push(payload.categoryName);
        } else {
            const flairs = await this.redditAPI.getFlairsBySubbreddit(payload.subredditName);
            const about = await this.redditAPI.getSubbredditAbout(payload.subredditName);

            subredditList.push({
                name: about.url.slice(2, about.url.length - 1),
                info: { flairs, ...about },
                categories: [payload.categoryName],
                notes: []
            });
        }

        await this.writeToFile(subredditList);
    }

    async deleteSubreddit(payload: DeleteSubredditPayload): Promise<void> {
        let subredditList = await this.getSubredditList();

        payload.subredditNames.forEach(nameToDelete => {
            // filter out subreddits by name
            subredditList = subredditList.filter((subreddit) => {
                return subreddit.name.toLocaleLowerCase() !== nameToDelete.toLocaleLowerCase();
            });
        });

        // write to state file with updated list
        await this.writeToFile(subredditList);
    }

    async writeToFile(newSubredditList: Subreddit[]): Promise<void> {
        await jsonfile.writeFile(this.file, newSubredditList), { spaces: 3 };
    }
}