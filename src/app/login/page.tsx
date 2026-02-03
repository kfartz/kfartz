"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PayloadSDK } from "@payloadcms/sdk";
import { useState } from "react";

export default function(){
    const sdk = new PayloadSDK({
        'baseURL': '/api'
      });
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    return  <div className="flex flex-col p-100">
                <Input title="login" placeholder="login" value={login} onChange={(e)=>{setLogin(e.target.value)}}>
                </Input>
                <Input type="password" value={password} onChange={(e)=>{setPassword(e.target.value)}}>
                </Input>
                <Button variant="outline"
                  size="default"
                  onClick={()=>{
                    sdk?.login({'collection': 'users', 'data': {'email': login, 'password': password}}).catch(()=>window.alert("invalid login"))
                  }}>
                    Log in
                </Button>
            </div>
}