/**
 *  Raw types for Reddit module
 * 
 *  Types for the raw data recieved from Reddit API.
 *  Used exclusively for assigning a type to Reddit API responses. 
 */
export interface SubredditAboutRaw {
    display_name: string;
    allow_videogifs: boolean;
    allow_videos: boolean;
    is_crosspostable_subreddit: boolean;
    over18: boolean;
    url: string;
}

export interface SubredditFlairRaw {
    text: string;
    text_editable: boolean;
    id: string;
}