import { AddSubredditPayload, DeleteSubredditPayload, SubredditCategory } from '../models/subredditListModel';
import { BodyParams } from '@tsed/common';
import { Controller } from '@tsed/di';
import { Delete, Get, Post } from '@tsed/schema';
import { SubredditListService } from '../services/subredditListService';

@Controller('/subredditListAPI')
export class SubredditListCtrl {
    constructor(private readonly injector: SubredditListService) { }
    @Get()
    async getSubredditList(): Promise<SubredditCategory[]> {
        return await this.injector.getSubredditList();
    }

    @Post()
    async addSubreddit(@BodyParams() payload: AddSubredditPayload): Promise<void> {
        return await this.injector.addSubreddit(payload);
    }

    @Delete()
    async deleteSubreddit(@BodyParams() payload: DeleteSubredditPayload): Promise<void> {
        return await this.injector.deleteSubreddit(payload);
    }
}