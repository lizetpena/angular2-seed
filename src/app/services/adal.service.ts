import { ConfigService } from './config.service';
import { Injectable } from '@angular/core';
import 'expose-loader?AuthenticationContext!../../../node_modules/adal-angular/lib/adal.js';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
let createAuthContextFn: adal.AuthenticationContextStatic = AuthenticationContext;

@Injectable()
export class AdalService {
    public resource:string;
    private context: adal.AuthenticationContext;
    constructor(private configService: ConfigService) {
        this.context = new createAuthContextFn(configService.AdalConfig);
       
    }

    login() {
        this.context.login();
    }

    logout() {
        this.context.logOut();
    }

    handleCallback() {
        this.context.handleWindowCallback();
    }

    
    public get userInfo() {
        return this.context.getCachedUser();
    }


    public get apiAccessToken()
    {

        var user = this.context.getCachedUser();
        console.log(user);

        //this.context = new createAuthContextFn(this.configService.ServiceConfig);

        var apiURI= this.configService.endpoints["https://localhost:44335"];
        var apiToken;

        
        this.context.acquireToken(apiURI, function (error, token) {
            console.log(error);
            console.log(token);
            apiToken=token;
            console.log(apiToken);
        });
        

       

        return apiToken;
        
    }
    public get accessToken() {


        var cachedToken =this.context.getCachedToken(this.configService.AdalConfig.clientId);
        
        return cachedToken;
        
    }

    public get isAuthenticated() {
        return this.userInfo && this.accessToken;
    }
}