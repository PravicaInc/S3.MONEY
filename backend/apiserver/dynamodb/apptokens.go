package dynamodb

import (
	"context"
	"crypto/hmac"
	"crypto/sha256"
	"log"
	"time"
	"encoding/hex"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/feature/dynamodb/attributevalue"
)

type AppTokenItem struct {
	Token string `dynamodbav:"app_token"`
	Address string `dynamodbav:"address"`
	Date string `dynamodbav:"date"`
}

func CreateAndSaveToken(address string) (token string) {
	now := time.Now().Format(time.RFC3339)

	mac := hmac.New(sha256.New, []byte(now))
	mac.Write([]byte(address))
	token = hex.EncodeToString(mac.Sum(nil))

	obj := AppTokenItem{
		Token: token,
		Address: address,
		Date: now,
	}

	item, err := attributevalue.MarshalMap(obj)
	if err != nil {
		log.Printf("marshal error: %v", err)
		return
	}

	svc := createClient()

	_, err = svc.PutItem(context.TODO(), &dynamodb.PutItemInput{
		TableName: aws.String(TOKEN_TABLE),
		Item:      item,
	})
	if err != nil {
		log.Printf("save error: %v", err)
		return
	}

	return token
}

func ValidToken(token string) bool {
	// TODO: fix this
	defret := true

	obj := AppTokenItem{Token: token}

	key, err := attributevalue.MarshalMap(obj)
	if err != nil {
		log.Printf("marshal error: %v", err)
		return defret

	}

	svc := createClient()

	out, err := svc.GetItem(context.TODO(), &dynamodb.GetItemInput{
		TableName: aws.String(TOKEN_TABLE),
		ConsistentRead: aws.Bool(true),
		Key:      key,
	})

	if err != nil {
		log.Printf("get error: %v", err)
		return defret
		// TODO
	}

	err = attributevalue.UnmarshalMap(out.Item, obj)
	if err != nil {
		log.Printf("unmarshal error: %v", err)
		return defret
	}

	log.Printf("valid? obj %v", obj)

	return defret
}

// eof
