import * as jsonfile from 'jsonfile';

import { SubredditCategory, SubredditDetails, SubredditInfo } from '../models/subredditListModel';

import { Injectable } from '@tsed/di';
import { RedditAPIService } from './redditAPIService';

@Injectable()
export class SubredditListService {
    private readonly file = 'src/storage/subreddits.json';
    constructor(private readonly redditAPI: RedditAPIService) { }

    async getSubredditList(): Promise<SubredditCategory[]> {
        try {
            return await jsonfile.readFileSync(this.file) as SubredditCategory[];
        } catch {
            // could not read from file. Reset file to and return an empty array
            this.writeToFile([]);
            return [];
        }
    }

    async addSubreddit(payload: SubredditDetails): Promise<void> {

        const subredditList = await this.getSubredditList();
        const objIndex = subredditList.findIndex(category => category.categoryName === payload.categoryName);

        if (objIndex >= 0 && subredditList[objIndex].subreddits.find(subreddit => subreddit.subredditName.toLocaleLowerCase() === payload.subredditName.toLocaleLowerCase())) {
            return;
        }

        const flairs = await this.redditAPI.getFlairsBySubbreddit(payload.subredditName);
        const about = (await this.redditAPI.getSubbredditAbout(payload.subredditName));

        const newSubbredditInfo: SubredditInfo = {
            flairs,
            notes: [],
            ...about
        };

        // if category exsists, add subreddit to it, if not create new category
        if (objIndex >= 0) {
            subredditList[objIndex].subreddits.push(newSubbredditInfo);
        } else {
            const newSubredditCategory: SubredditCategory = {
                categoryName: payload.categoryName,
                subreddits: [newSubbredditInfo]
            };
            subredditList.push(newSubredditCategory);
        }

        this.writeToFile(subredditList);
    }

    async deleteSubreddit(payload: SubredditDetails[]): Promise<void> {
        const subredditList = await this.getSubredditList();
        payload.forEach(subredditToDelete => {

            // get the category index of the subreddit to delete
            const objIndex = subredditList.findIndex(category => category.categoryName === subredditToDelete.categoryName);

            // use the category index to filter out the selected subreddit from that catreogry
            subredditList[objIndex].subreddits = subredditList[objIndex].subreddits.filter((subreddit) => {
                return subreddit.subredditName !== subredditToDelete.subredditName;
            });
        });
        // filter out any catergories with no subreddits and write to state file with updated list
        this.writeToFile(subredditList.filter(category => category.subreddits.length));
    }

    async writeToFile(newSubredditList: SubredditCategory[]): Promise<void> {
        jsonfile.writeFileSync(this.file, newSubredditList), { spaces: 3 };
    }
}