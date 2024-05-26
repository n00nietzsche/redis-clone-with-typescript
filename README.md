## 프로젝트 설명

- Typescript 를 통해 Redis 서버를 구현합니다.
- Javascript Runtime 은 Bun 을 이용합니다.
- Vitest 를 이용해 테스트합니다.

## Redis 참조 문서

- [Redis 통신규약](https://redis.io/docs/latest/develop/reference/protocol-spec/)
  - [쉬운 버전으로 쓰인 아티클](https://lethain.com/redis-protocol/)

## Codecrafters Challange

This is a starting point for TypeScript solutions to the
["Build Your Own Redis" Challenge](https://codecrafters.io/challenges/redis).

In this challenge, you'll build a toy Redis clone that's capable of handling
basic commands like `PING`, `SET` and `GET`. Along the way we'll learn about
event loops, the Redis protocol and more.

**Note**: If you're viewing this repo on GitHub, head over to
[codecrafters.io](https://codecrafters.io) to try the challenge.

# Passing the first stage

The entry point for your Redis implementation is in `app/main.ts`. Study and
uncomment the relevant code, and push your changes to pass the first stage:

```sh
git add .
git commit -m "pass 1st stage" # any msg
git push origin master
```

That's all!

# Stage 2 & beyond

Note: This section is for stages 2 and beyond.

1. Ensure you have `bun (1.1)` installed locally
1. Run `./spawn_redis_server.sh` to run your Redis server, which is implemented
   in `app/main.ts`.
1. Commit your changes and run `git push origin master` to submit your solution
   to CodeCrafters. Test output will be streamed to your terminal.
