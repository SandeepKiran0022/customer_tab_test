import axios from 'axios';
import { getAPIBaseUrl } from './utils'
import { Validator, LoginValidations, TrainerValidations, ExistingTrainerValidations, PlanValidations, ClassValidations, CustomerValidations, ExistingCustomerValidations, EnrollPlayerValidations } from './validator';

let baseURL = getAPIBaseUrl()

const config = {
    get: () => {
        return {
            baseURL,
            headers: window.currentOrg ? { 'X-Organization-ID':  window.currentOrg.id } : {},
            withCredentials: true
        };
    }
}

/* Helper */

const requestor = {
    post: (url, data, conf) => axios.post(url, data, {...config.get(), ...conf}),
    get: (url, params) => axios.get(url, { ...config.get(), params }),
    delete: url => axios.delete(url, config.get()),
    patch: (url, params) => axios.patch(url, params, config.get()),
    put: (url, params) => axios.put(url, params, config.get())
}


/* Api Definition Starts */

export const Account = {
    get: () => requestor.get('/me')
}

export const Auth = {
    login: (creds) => 
        Validator.validate(LoginValidations, creds)
            .then(() => requestor.post('/auth/login', creds)),
    changePassword: (data) => requestor.put('/auth/password', data),
    logout: () => requestor.post('/auth/logout')
}

export const Arenas = {
    get: (search) => requestor.get('/arenas', {search}),
    getCourses: (arenaId) => requestor.get(`/arenas/${arenaId}/courses`),
}

export const Classes = {
    get: (search) => requestor.get('/coachings', {search}),
    createOrEdit: (clazzId, clazz) => 
        Validator.validate(ClassValidations, clazz)
            .then(() => {
                if (clazzId) {
                    return requestor.patch(`/coachings/${clazzId}`, clazz)
                } else {
                    return requestor.post('/coachings', clazz)
                }
            }),
}

export const Plans = {
    get: (search) => requestor.get('/memberships', {search}),
    createOrEdit: (planId, plan) => 
        Validator.validate(PlanValidations, plan)
            .then(() => {
                if (planId) {
                    return requestor.patch(`/memberships/${planId}`, plan)
                } else {
                    return requestor.post('/memberships', plan)
                }
            }),
    delete: (planId) => requestor.delete('/memberships/'+ planId)
}

export const Players = {
    getPublicDetail: mobile => requestor.get('/players/detail', { mobile }),
    get: (search, subscription, mobile, from_date, to_date, status) => requestor.get('/players', { search, subscription, mobile, from_date, to_date, status }),
    getPlayer: (playerId) => requestor.get('/players/' + playerId),
    create: (player) => 
        Validator.validate((!!player.user_id)?ExistingCustomerValidations:CustomerValidations, player)
            .then(() => requestor.post('/players', player)),
    delete: (playerId) => requestor.delete('/players/'+ playerId),
    remind: (user_ids) => requestor.post('/remind', { user_ids } ),
    notify: (details) => requestor.post('/notify', details ),
    enroll: (enrollTo, planId, player) => 
        Validator.validate(EnrollPlayerValidations, player)
            .then(() => requestor.post('/' + (enrollTo === 'class' ? 'coachings' : 'memberships') + '/' + planId + '/players', player)),
    getSubscriptions:(playerId)=>requestor.get('/players/'+playerId+'/subscriptions'),
    getTransactions:(playerId)=>requestor.get(`/players/${playerId}/transactions`),
    endSubscription:(playerId, subscriptionId, data)=>requestor.post(`/players/${playerId}/subscriptions/${subscriptionId}/end`, data),
    edit:(player)=> 
        Validator.validate(CustomerValidations, player)
            .then(() => requestor.patch(`/players/${player.id}`,player))
}

export const Trainers = {
    getPublicDetail: mobile => requestor.get('/trainers/detail', { mobile }),
    get: (search) => requestor.get('/trainers', { search }),
    createOrEdit: (trainerId, trainer) => 
        Validator.validate((!!trainer.user_id && !trainerId) ? ExistingTrainerValidations : TrainerValidations, trainer)
            .then(() => {
                if (trainerId) {
                    return requestor.patch(`/trainers/${trainerId}`, trainer)
                } else {
                    return requestor.post('/trainers', trainer)
                }
            }),
    delete: (playerId) => requestor.delete('/trainers/'+ playerId)
}

export const Invoices = {
    get: (search, filter, from_date, to_date) => requestor.get('/invoices' + (filter && filter !== 'all' ? "?status=" + filter : ""), {search, from_date, to_date}),
    getInvoice: (invoiceId, params) => requestor.get('/invoices/' + invoiceId , params),
    void: (invoiceId) => requestor.post('/invoices/' + invoiceId + '/void'),
    delete: (invoiceId) => requestor.delete('/invoices/' + invoiceId)
}

export const Payments = {
    get: (search, pay_mode, from_date, to_date) => requestor.get('/payments' + (pay_mode && pay_mode !== 'all' ? "?pay_mode=" + pay_mode : ""), {search, from_date, to_date}),
    create: (payment) => requestor.post('/payments', payment),
    delete: (paymentId) => requestor.delete(`/payments/${paymentId}`)
}

export const ImageUpload = {
    post:(formData) => requestor.post('/upload',formData,{ headers: { "Content-Type": "multipart/form-data" } }),
}

export const Setting = {
    patch:(jsonParam)=>requestor.patch('/settings',jsonParam),
    get:()=> requestor.get('/settings')
} 

export const Subscription = {
    get: (search, status, subscription) => requestor.get('/subscriptions',{search, status, subscription}),
    delete: (customerId, enrollmentId) => requestor.delete(`/players/${customerId}/subscriptions/${enrollmentId}`)
}

export const TaxGroup = {
    get: () => requestor.get('/taxgroups'),
    create: (data) => requestor.post('/taxgroups', data)
} 
