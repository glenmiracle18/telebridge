# Setting Up Clerk Webhooks for TeleBridge

This guide explains how to set up Clerk webhooks to automatically create users in your database when they sign up through Clerk.

## 1. Create a Webhook Endpoint in Clerk Dashboard

1. Go to the [Clerk Dashboard](https://dashboard.clerk.dev/)
2. Select your application
3. Navigate to **Webhooks** in the left sidebar
4. Click **Add Endpoint**
5. Enter your webhook URL: `https://your-domain.com/api/webhooks/clerk`
   - For local development, you can use a service like [ngrok](https://ngrok.com/) to expose your local server
6. Under **Events**, select the following events:
   - `user.created`
   - `user.updated` (optional)
   - `user.deleted` (optional)
7. Click **Create**
8. Copy the **Signing Secret** - you'll need this for your environment variables

## 2. Set Environment Variables

Add the following environment variable to your `.env` file:

```
CLERK_WEBHOOK_SECRET=your_signing_secret_here
```

## 3. Deploy Your Application

Make sure your application is deployed with the updated webhook handler and environment variables.

## 4. Test the Webhook

1. Sign up a new user in your application
2. Check your application logs to verify that the webhook was received and processed
3. Verify that the user was created in your database

## Troubleshooting

### Webhook Not Triggering

- Check that your webhook URL is correct and accessible
- Verify that you've selected the correct events in the Clerk dashboard
- Check your application logs for any errors

### Database Errors

- Ensure your database is properly set up and accessible
- Check that your Prisma schema matches the data structure you're trying to create
- Verify that the `CLERK_WEBHOOK_SECRET` environment variable is set correctly

## Additional Resources

- [Clerk Webhooks Documentation](https://clerk.com/docs/users/sync-data-to-your-backend#sync-with-webhooks)
- [Svix Documentation](https://docs.svix.com/) (Clerk uses Svix for webhooks) 