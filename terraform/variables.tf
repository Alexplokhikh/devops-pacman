variable "project_name" {
  description = "Project name used for AWS resource naming"
  type        = string
  default     = "devops-pacman"
}

variable "aws_region" {
  description = "AWS region where resources will be deployed"
  type        = string
  default     = "eu-central-1"
}

variable "vpc_cidr" {
  description = "CIDR block for the project VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "cluster_name" {
  description = "Name of the EKS cluster"
  type        = string
  default     = "devops-pacman-eks"
}

variable "kubernetes_version" {
  description = "Kubernetes version for the EKS cluster"
  type        = string
  default     = "1.34"
}

variable "ecr_repository_name" {
  description = "Name of the ECR repository for the Pac-Man image"
  type        = string
  default     = "devops-pacman"
}