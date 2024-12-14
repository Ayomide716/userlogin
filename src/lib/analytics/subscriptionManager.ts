import { Unsubscribe } from 'firebase/firestore';

class SubscriptionManager {
  private subscriptions: Map<string, Unsubscribe> = new Map();
  private activeSubscriptions: Set<string> = new Set();

  addSubscription(id: string, unsubscribe: Unsubscribe) {
    // If there's already an active subscription with this ID, clean it up first
    if (this.activeSubscriptions.has(id)) {
      this.cleanupSubscription(id);
    }
    
    this.subscriptions.set(id, unsubscribe);
    this.activeSubscriptions.add(id);
  }

  cleanupSubscription(id: string) {
    const existing = this.subscriptions.get(id);
    if (existing) {
      try {
        existing();
        this.subscriptions.delete(id);
        this.activeSubscriptions.delete(id);
      } catch (error) {
        console.error(`Error cleaning up subscription ${id}:`, error);
      }
    }
  }

  cleanupAll() {
    const subscriptionIds = Array.from(this.activeSubscriptions);
    subscriptionIds.forEach(id => this.cleanupSubscription(id));
  }

  isSubscriptionActive(id: string): boolean {
    return this.activeSubscriptions.has(id);
  }
}

export const subscriptionManager = new SubscriptionManager();