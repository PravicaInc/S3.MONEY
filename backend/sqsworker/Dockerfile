# docker build --platform linux/amd64 -t s3money-sqsworker:test .

FROM golang:1.22 as build

WORKDIR /build
# deps
COPY go.mod go.sum ./
# sources
COPY sqsworker.go .
RUN go build -tags lambda.norpc -o sqsworker sqsworker.go

FROM public.ecr.aws/lambda/provided:al2023

COPY --from=build /build/sqsworker ./sqsworker

ENTRYPOINT [ "./sqsworker" ]
