import * as Reddit from 'reddit';

import { SubredditAbout, SubredditFlair } from '../utils/types';

import { Injectable } from '@tsed/di';

interface SubredditAboutRaw {
    readonly display_name: string;
    readonly allow_videogifs: boolean;
    readonly allow_videos: boolean;
    readonly is_crosspostable_subreddit: boolean;
    readonly over18: boolean;
    readonly url: string;
}

interface SubredditFlairRaw {
    readonly text: string;
    readonly text_editable: boolean;
    readonly id: string;
}

interface RedditCreds {
    username: string,
    password: string,
    appId: string,
    appSecret: string
}

@Injectable()
export class RedditAPIService {

    /**
     * Reddit API Credentials 
     */
    private readonly reddit: RedditCreds = new Reddit({
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
        const aboutRaw = (await this.reddit.get(`/r/${subredditName}/about.json`))?.data as SubredditAboutRaw;
        return {
            url: aboutRaw.url,
            allowsVideoGifs: aboutRaw.allow_videogifs,
            allowsVideos: aboutRaw.allow_videos,
            isCrosspostable: aboutRaw.is_crosspostable_subreddit,
            isNSFW: aboutRaw.over18
        };
    }

    /**
     * Gets an array of posts flairs for a subreddit.
     * @param subredditName the name of the subreddit 
     * @returns the array of post flairs
     */
    async getFlairsBySubbreddit(subredditName: string): Promise<SubredditFlair[]> {
        try {
            return (await this.reddit.get(`/r/${subredditName}/api/link_flair`) as SubredditFlairRaw[])
                .map((flairRaw): SubredditFlair => {
                    return {
                        name: flairRaw.text,
                        isTextEditable: flairRaw.text_editable,
                        id: flairRaw.id
                    };
                });
        } catch (e) {
            // api returns 403 if flairs are not enabled, so return empty array if error
            return [];
        }
    }
}