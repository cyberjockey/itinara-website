export default {
    async fetch(request: Request, env: any, ctx: any): Promise<Response> {
        return new Response('Itinara API Gateway Active');
    },
};
