package ir.mrmoein.quezapplication.model.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.validation.constraints.Future;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.time.Instant;
import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
@SuperBuilder
public class TokenBlackList extends BaseEntity<UUID> {

    @OneToOne
    private JwtRefreshToken jwtRefreshToken;

    @Future
    private Instant expiresAt;

    @PrePersist
    public void persist() {
        this.expiresAt = Instant.now().minusSeconds(60 * 60 * 24);
    }

}
