import fs from 'fs';
import path from 'path'

export const rpcUrl = () => {
    if (process.env.VORTEX_RPC_URL) {
        return process.env.VORTEX_RPC_URL
    } else if (process.env.RPC_URL) {
        return process.env.RPC_URL
    } else {
        return 'http://127.0.0.1:2522'
    }
};

export const rpcUser = () => {
    if (process.env.VORTEX_RPC_USER === undefined) {
        try {
            const home = process.env.HOME;
            const filePath = path.join(home, '.ln-vortex', '.rpc.cookie');
            const data = fs.readFileSync(filePath);
            const [user] = data.toString().split(':');
            return user;
        } catch (err) {
            throw new Error("RPC_USER is not defined")
        }
    } else return process.env.VORTEX_RPC_USER;
};

export const rpcPassword = () => {
    if (process.env.VORTEX_RPC_PASSWORD === undefined) {
        try {
            const home = process.env.HOME;
            const filePath = path.join(home, '.ln-vortex', '.rpc.cookie');
            const data = fs.readFileSync(filePath);
            const [_, password] = data.toString().split(':');
            return password.trim();
        } catch (err) {
            throw new Error("RPC_PASSWORD is not defined")
        }
    } else return process.env.VORTEX_RPC_PASSWORD;
};
