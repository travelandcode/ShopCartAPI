import logger from '../logs/logger';
import { User } from '../models/d'
import UsersModel from '../models/users'

export class UserService{
    constructor(){
        this.findUser = this.findUser.bind(this)
        this.createUser = this.createUser.bind(this)
        this.editUser = this.editUser.bind(this)
        this.editUser = this.editUser.bind(this)
        this.deleteUser = this.deleteUser.bind(this)
    }

    async findUser(email:string){
        try{
            const user = await UsersModel.findOne({email: email})
            return user
        }catch(error){
            logger.error(error)
        }
    }

    async createUser(user:User){
        try{
            const existingUser = await this.findUser(user.email)
            if(existingUser) return null
            const newUser = await UsersModel.create(user)
            return newUser
        }catch(error){
            logger.error(error)
        }
    }

    async editUser(user:User){
        try{
            const existingUser = await this.findUser(user.email)
            if(!existingUser) return null
            const editedUser = await UsersModel.findOneAndUpdate({email:existingUser.email},{$set: {user}},{new:true})
            return editedUser
        }catch(error){
            logger.error(error)
        }
    }

    async deleteUser(email:string){
        try{
            const existingUser = await this.findUser(email)
            if(!existingUser) return null
            const deletedUser = await UsersModel.findOneAndDelete({email:existingUser.email})
            return deletedUser
        }catch(error){
            logger.error(error)
        }
    }
}