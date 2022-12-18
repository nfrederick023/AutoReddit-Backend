import * as Reddit from 'reddit';

import { Flair, FlairRaw, SubredditAbout, SubredditAboutRaw, } from '../models/redditAPIModel';

import { Injectable } from '@tsed/di';

@Injectable()
export class RedditAPIService {

    /**
     * Reddit API Credentials 
     */
    private readonly reddit = new Reddit({
        username: process.env.REDDIT_USERNAME,
        password: process.env.PASSWORD,
        appId: process.env.APP_ID,
        appSecret: process.env.APP_SECRET,
    });

    /**
     * Retrieves the about.JSON for a subreddit
     * @param subredditName the name of the subreddit 
     * @returns a lite version of the about.JSON data
     */
    async getSubbredditAbout(subredditName: string): Promise<SubredditAbout> {
        const aboutData = (await this.reddit.get(`/r/${subredditName}/about.json`))?.data as SubredditAboutRaw;
        return {
            name: aboutData.display_name,
            url: aboutData.url,
            allowsVideoGifs: aboutData.allow_videogifs,
            allowsVideos: aboutData.allow_videos,
            isCrosspostable: aboutData.is_crosspostable_subreddit,
            isNSFW: aboutData.over18
        };
    }

    /**
     * Gets an array of posts flairs for a subreddit.
     * @param subredditName the name of the subreddit 
     * @returns the array of post flairs
     */
    async getFlairsBySubbreddit(subredditName: string): Promise<Flair[]> {
        try {
            return (await this.reddit.get(`/r/${subredditName}/api/link_flair`) as FlairRaw[])
                .map((flair): Flair => {
                    return {
                        name: flair.text,
                        id: flair.id,
                        isTextEditable: flair.text_editable
                    };
                });
        } catch (e) {
            // api returns 403 if flairs are not enabled, so return empty array if error
            return [];
        }
    }
}