# ARQ Protocol implementations.
This repository is dedicated to my final work for my bachelor's degree in computer science. It serves as a monorepo that contains custom-made apps and libraries for implementing and testing various ARQ (Automatic Repeat Request) protocols under different network conditions.

## Introduction

The primary goal of this project is to explore and evaluate the performance characteristics of different ARQ protocols. By implementing these protocols and subjecting them to diverse network conditions, we can gain valuable insights into their behavior and efficiency.

The ARQ protocols implemented in this repository include:

-   Stop And Wait
-   Go Back N
-   Selective Repeat

These protocols represent a range of strategies for handling packet loss and ensuring reliable data transmission across unreliable networks.

## Structure

The repository follows a monorepo structure, allowing for the management of multiple apps and libraries within a unified codebase. This approach facilitates code reuse, collaboration, and the organization of related components.

### Simulated environment
![enter image description here](https://lh3.googleusercontent.com/pw/AJFCJaVYPoG3qFJce-ev8lgz9g5PAyNmLwk6XVyDxylmSeAVeXJw_bL3lw45ya5qQ0SFaA8vXG8YhqOfMaGc2dLzsaLiHtHBdvqhDyyI57T_tvWYewZpIsz2kwggdv98wkrTA9kRI1znx8rwnHpEY6VyTYQ=w885-h446-s-no)

Commands for running iPerf:

iPerf client connecting to 127.0.0.1:2000  (2000 the default port of the UDP Server)
> iperf -u -c 127.0.0.1 -p 2000

iPerf server listening on port 4000 (the default port where the UDP Client connects to)
> iperf -u -s -p 4000