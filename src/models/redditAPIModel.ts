/** 
 * Regular types are converted Raw types which better suit the purpose of this application
 */
export interface Flair {
    name: string;
    isTextEditable: boolean;
    id: string;
}

export interface SubredditAbout {
    name: string;
    url: string;
    allowsVideoGifs: boolean;
    allowsVideos: boolean;
    isCrosspostable: boolean;
    isNSFW: boolean;
}

/**
 *  Raw types are data types for the raw data recieved from Reddit API.
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

export interface FlairRaw {
    text: string;
    text_editable: boolean;
    id: string;
}