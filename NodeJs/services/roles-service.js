const AppError = require("../helpers/appError");
const {ErrorType} = require("../helpers/enums");

class RoleService {

    constructor(roleDal) {
        this.roleDal = roleDal;
    }

    /**
     * Create new role
     * @param role
     * @returns {role}
     */
    createRole(role) {
        if (!role.name) {
            throw  new AppError("Role name is required", ErrorType.validation_error);
        }
        return this.roleDal.create(role);
    }

    /**
     * Delete role by id
     * @param id
     * @returns {Promise<boolean>}
     */
    async deleteRoleById(id) {
        let deleted = await this.roleDal.deleteById(id);
        if (!deleted) {
            throw new AppError("Delete failed", ErrorType.invalid_request);
        }

        return deleted;
    }

    /**
     * Get Role by name
     * @param name
     * @returns {Promise<*>}
     */
    async getRoleByName(name) {
        let role = await this.roleDal.findOne({name: name});
        if (!role) {
            throw  new AppError("Role "+name+" not found", ErrorType.not_found);
        }
        return role;
    }

    /**
     * Get Role by id
     * @param id
     * @returns {Promise<*>}
     */
    async getRoleById(id) {
        let role = await this.roleDal.findById(id);
        if (!role) {
            throw  new AppError("Role not found", ErrorType.not_found);
        }
        return role;
    }

    /**
     * Get all roles
     * @returns {Promise<*>}
     */
    async getRoles() {
        return this.roleDal.find();
    }

}

module.exports = RoleService;