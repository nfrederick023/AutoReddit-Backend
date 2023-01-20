import '@tsed/swagger';

import { Configuration, Inject } from '@tsed/di';

import { PlatformApplication } from '@tsed/common';
import { SubredditListCtrl } from './controllers/subredditListCtrl';
import cors from 'cors';

@Configuration({
    acceptMimes: ['application/json'],
    mount: {
        '/rest': [SubredditListCtrl]
    },
    swagger: [
        {
            path: '/v3/docs',
            specVersion: '3.0.1'
        }
    ]
})

export class Server {
    @Inject()
    protected app!: PlatformApplication;

    $beforeRoutesInit(): void {
        this.app.use(cors()); // fixes CORS error
    }
}