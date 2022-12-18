import * as dotenv from 'dotenv';

import { $log } from '@tsed/common';
import { PlatformExpress } from '@tsed/platform-express';
import { Server } from './server';

const bootstrap = async (): Promise<void> => {
    try {
        dotenv.config();
        $log.debug('Start server...');
        const platform = await PlatformExpress.bootstrap(Server, {
        });

        await platform.listen();
        $log.debug('Server initialized');
    } catch (er) {
        $log.error(er);
    }
};

bootstrap();