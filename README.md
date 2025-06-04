# AutoGPT-Next-Web (Pawan API Edition)

One-Click to deploy well-designed AutoGPT-Next-Web web UI on Vercel, with support for both Pawan's API and Hugging Face models.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FIg0tU%2FAutoGPT-Next-Web&project-name=autogpt-next-web&repository-name=AutoGPT-Next-Web)

## Features
1. Free one-click deployment with Vercel
2. Pre-configured to use Pawan's API - no OpenAI API key required
3. Hugging Face Integration with multiple models
4. Streaming responses for faster interactions
5. Mobile-friendly interface
6. Enhanced security headers

## Usage
1. Click the "Deploy with Vercel" button above
2. Follow the Vercel deployment process
3. Once deployed, you can start using the app immediately

### Using Hugging Face Models
1. Open Model Settings
2. Select "Hugging Face" as provider
3. Enter your Hugging Face API key
4. Choose a model and adjust settings
5. Save changes

## Development

1. Clone and install:
```bash
git clone
cd AutoGPT-Next-Web
npm install
```

2. Configure environment:
```bash
# .env.local
OPENAI_API_KEY=your_pawan_api_key
OPENAI_API_BASE_URL=https://api.pawan.krd/v1
HUGGINGFACE_API_KEY=your_huggingface_api_key  # Optional
```

3. Start development:
```bash
npm run dev
```

4. Run tests:
```bash
npm test
```

## Security
- Enhanced HTTP headers
- Environment protection
- Secure API handling
- Input validation
- Error handling

## License
MIT License
