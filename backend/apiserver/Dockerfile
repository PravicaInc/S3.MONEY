# docker build --platform linux/amd64 -t s3money-apiserver:test .

FROM golang:1.22 as build

WORKDIR /build
# deps
COPY go.mod go.sum ./
# sources
COPY apiserver.go .
RUN go build -tags lambda.norpc -o apiserver apiserver.go

FROM public.ecr.aws/lambda/provided:al2023

COPY --from=build /build/apiserver ./apiserver

ENTRYPOINT [ "./apiserver" ]
