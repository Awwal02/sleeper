import { Module } from '@nestjs/common';
import { ConfigurableModuleClass } from '@nestjs/common/cache/cache.module-definition';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ModelDefinition, MongooseModule } from '@nestjs/mongoose';

@Module({
    imports: [MongooseModule.forRootAsync({
        // imports: [ConfigModule],
        useFactory: (configService: ConfigService) => {
        console.log(configService.get('MONGODB_URI'))
            return {
            uri: configService.get('MONGODB_URI')
        }
        },
        inject: [ConfigService]
    })]
})
export class DatabaseModule{
    static forFeature(models: ModelDefinition[]) {
        return MongooseModule.forFeature(models)
    }
}
