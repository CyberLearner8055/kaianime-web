module.exports = {
  apps: [
    {
      name: 'kaianime',
      script: 'npm',
      args: 'run start',
      cwd: '/home/kaianime.me/public_html',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      exp_backoff_restart_delay: 100,
      env: {
        NODE_ENV: 'production',
        PORT: '3050'
      }
    }
  ]
};
