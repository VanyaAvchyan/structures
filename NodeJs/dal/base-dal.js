const AppError = require("./../helpers/appError");
const {ErrorType} = require("../helpers/enums");


class BaseDal {
    /***
     * @param context
     */
    constructor(context) {
        this.context = context;
        this.operations = context.meta.operations;
    }

    /***
     * Find many by condition
     * @param query
     * @param offset
     * @param limit
     * @param include
     * @param transaction
     * @returns {Promise<*>}
     */
    async find(query = {}, offset = 0, limit = 100, include=[], transaction=null) {
        let q = {
            where: query,
            offset: offset,
            transaction: transaction,
            include

        };
        if (limit != -1) {
            q.limit = limit
        }

        let res = await this.getModel().findAll(q);

        return res.map(o=>o.toJSON());
    }

    /***
     * Find Onw by cindition
     * @param query
     * @param include
     * @param transaction
     * @returns {Promise<*>}
     */
    async findOne(query = {}, include=[], transaction=null) {
        let dbObject = await this.getModel().findOne({where: query,
            transaction: transaction,
            include: include
        });

        return dbObject && dbObject.toJSON();
    }

    /**
     * find by id
     * @param id
     * @param include
     * @param transaction
     * @returns {Promise<*>}
     */
    async findById(id, include =[], transaction=null) {
        let item = await this.getModel().findByPk(id, {transaction, include: include});
        return item && item.toJSON();
    }

    /**
     * Create new entity
     * @param item
     * @param fields
     * @param transaction
     * @returns {Promise<*>}
     */
    async create(item, fields = [], transaction = null) {
        let newObj = await  this.getModel().create(item, {fields: fields.length ? fields : null,  transaction: transaction});
        return newObj &&newObj.toJSON()
    }

    /**
     * update by id
     * @param id
     * @param item
     * @param fields
     * @param transaction
     * @returns {Promise<boolean>}
     */
    async updateById(id, item, fields = [], transaction=null) {
        let isUpdate = await this.getModel().update(
            item,
            {
                fields: fields.length ? fields : null,
                transaction: transaction,
                where: {
                    id: id
                }
            });
        return Boolean(isUpdate[0]);
    }

    async deleteById(id, transaction) {
        let deleted =  await this.getModel().destroy({
            where: {
                id : id
            },
            transaction: transaction
        });
        return Boolean(deleted);
    }

    /**
     * Check if id exists
     * @param id
     * @returns {Promise<boolean>}
     */
    async exists(id) {
        let item = await (this.getModel()).findByPk(id);
        return Boolean(item)
    }

    transaction() {
        return this.context.meta.transaction();
    }

    getModel() {
        throw new Error('Collection is unknown')
    }

}

module.exports = BaseDal;