import { FilterQuery, Model, Types, UpdateQuery } from "mongoose";
import { AbstractDocument } from "./abstract.schema";
import { Logger, NotFoundException } from "@nestjs/common";

export abstract class AbstractRepository<TDocument extends AbstractDocument> {
    protected abstract readonly logger: Logger;
    constructor(protected readonly model: Model<TDocument>) {

    }

    async create(document: Omit<TDocument,'_id'> ) : Promise<TDocument> {
        const createDoc = new this.model({
            ...document,
            _id: new Types.ObjectId()
        })
        return (await createDoc.save()).toJSON() as unknown as TDocument
    }

    async findOne(filterQuery: FilterQuery<TDocument>) {
        const doc = await this.model.findOne(filterQuery, {}, {lean: true})

        if(!doc) {
            this.logger.warn('Document not found ', filterQuery)
            throw new NotFoundException('Doc not Found') //404
        }
        return doc
    }

    async findOneAndUpdate(
        filterQuery: FilterQuery<TDocument>,
        update: UpdateQuery<TDocument>
    ) {
        const doc = this.model.findOneAndUpdate(filterQuery, update, {
            lean: true,
            new: true // return newly updated doc
        })

        if(!doc) {
            this.logger.warn('Document not found ', filterQuery)
            throw new NotFoundException('Doc not Found') //404
        }

        return doc;
    }

    async find(filterQuery: FilterQuery<TDocument>) {
        return this.model.find(filterQuery, {}, {lean: true});
    }

    async findOneAndDelete(filterQuery: FilterQuery<TDocument>) {
        return this.model.findOneAndDelete(filterQuery,{lean: true})
    }
}